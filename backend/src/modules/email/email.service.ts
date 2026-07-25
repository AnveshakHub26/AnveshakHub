import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendWelcomeEmail(email: string, name: string) {
    this.logger.log(`[Email Service] Sending Welcome Email to ${email} (${name})`);
    return { status: 'sent', recipient: email, template: 'registration_welcome' };
  }

  async sendPasswordResetEmail(email: string, resetLink: string) {
    this.logger.log(`[Email Service] Sending Password Reset Email to ${email}`);
    return { status: 'sent', recipient: email, template: 'password_reset' };
  }

  async sendProjectInvitation(email: string, projectTitle: string, inviterName: string) {
    this.logger.log(`[Email Service] Sending Project Invitation (${projectTitle}) to ${email}`);
    return { status: 'sent', recipient: email, template: 'project_invitation' };
  }

  async sendMeetingInvitation(email: string, meetingTitle: string, scheduledTime: string, joinUrl: string) {
    this.logger.log(`[Email Service] Sending Meeting Invitation (${meetingTitle}) to ${email}`);
    return { status: 'sent', recipient: email, template: 'meeting_invitation' };
  }

  async sendApplicationStatusEmail(email: string, projectTitle: string, status: string) {
    this.logger.log(`[Email Service] Sending Application Status (${status}) to ${email}`);
    return { status: 'sent', recipient: email, template: 'application_status' };
  }

  async sendVerificationStatusEmail(email: string, profileType: string, isVerified: boolean) {
    this.logger.log(`[Email Service] Sending Verification Status (${isVerified ? 'VERIFIED' : 'REJECTED'}) to ${email}`);
    return { status: 'sent', recipient: email, template: 'verification_status' };
  }
}
