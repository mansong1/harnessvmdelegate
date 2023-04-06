import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
import * as Harnessvmdelegate from '../lib/harnessvmdelegate-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/harnessvmdelegate-stack.ts
test('Check InstanceType', () => {
    const app = new cdk.App();
    const stack = new Harnessvmdelegate.HarnessvmdelegateStack(app, 'MyTestStack');

    expectCDK(stack).to(haveResourceLike('AWS::EC2::Instance', {
        InstanceType: 't2.large'
    }));
    //     // WHEN
    //   const stack = new Harnessvmdelegate.HarnessvmdelegateStack(app, 'MyTestStack');
    //     // THEN
    //   const template = Template.fromStack(stack);

    //   template.hasResourceProperties('AWS::SQS::Queue', {
    //     VisibilityTimeout: 300
    //   });
});
