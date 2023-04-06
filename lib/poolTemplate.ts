// lib/poolTemplate.ts
interface PoolTemplateParams {
  linuxAmi: string;
  windowsAmi: string;
  iamProfileArn: string;
  securityGroupLinux: string;
  securityGroupWindows: string;
}

export function generatePoolTemplate(params: PoolTemplateParams): string {
  return `
  version: "1"
  instances:
    - name: linux-pool
      default: true
      type: amazon
      pool: 1
      limit: 4
      platform:
        os: linux
        arch: amd64
      spec:
        account:
          region: eu-west-2
          availability_zone: eu-west-2c
        ami: ${params.linuxAmi}
        size: t2.nano
        iam_profile_arn: ${params.iamProfileArn}
        network:
          security_groups:
          - ${params.securityGroupLinux}
    - name: windows-pool
      default: true
      type: amazon
      pool: 1
      limit: 4
      platform:
        os: windows
      spec:
        account:
          region: eu-west-2
          availability_zone: eu-west-2c
        ami: ${params.windowsAmi}
        size: t3.large
        hibernate: true
        network:
          security_groups:
          - ${params.securityGroupWindows}
  `;
}