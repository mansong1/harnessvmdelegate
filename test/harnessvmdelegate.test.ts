import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Harnessvmdelegate from '../lib/harnessvmdelegate-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/harnessvmdelegate-stack.ts
test('Check InstanceType', () => {
    // GIVEN
    const app = new cdk.App();
    // WHEN
    const stack = new Harnessvmdelegate.HarnessvmdelegateStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);
    // THEN
    template.hasResourceProperties('AWS::EC2::Instance', {
        InstanceType: 't2.large'
    })
});
