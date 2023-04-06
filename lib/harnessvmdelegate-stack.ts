import * as cdk from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2"; // import ec2 library
import * as iam from 'aws-cdk-lib/aws-iam';
import * as fs from 'fs';

import { Construct } from 'constructs';

export class HarnessvmdelegateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, { ...props, env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION } });

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });

    const role = new iam.Role(this, 'HarnessVMDelegateRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('ec2.amazonaws.com'),
        new iam.ServicePrincipal('ssm.amazonaws.com')
      ),
      managedPolicies: [
        // allows us to access instance via SSH using IAM and SSM
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess'),
      ],
    });

    const securityGroup = new ec2.SecurityGroup(
      this,
      'HarnessVMDelegateSecurityGroup',
      {
        vpc: vpc,
        allowAllOutbound: true,
        description: 'Harness VM Delegate Security Group',
        securityGroupName: 'HarnessVMDelegateSecurityGroup',
      }
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH from anywhere'
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(9079),
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3389),
      'Allow RDP from anywhere'
    );

    const instance = new ec2.Instance(this, 'HarnessVMDelegateInstance', {
      vpc: vpc,
      role: role,
      securityGroup: securityGroup,
      instanceName: 'HarnessVMDelegateInstance',
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.LARGE),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        cpuType: ec2.AmazonLinuxCpuType.X86_64,
      }),
    });

    instance.addUserData(
      fs.readFileSync('src/userdata.sh', 'utf-8')
    );

    new cdk.CfnOutput(this, "SSMCommand", { value: `aws ssm start-session --target ${instance.instanceId}` });
  }
}
