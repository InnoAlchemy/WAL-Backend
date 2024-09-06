import nodemailer from "nodemailer";
import path from "path";

import User from "#/models/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import {
  MAILTRAP_PASSWORD,
  MAILTRAP_USER,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
} from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASSWORD,
    },
  });

  return transport;
};

interface Profile {
  userName: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();

  const { userName, email, userId } = profile;

  const welcomeMessage = `Hi ${userName}, welcome to Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Welcome message",
    html: generateTemplate({
      title: "Welcome to Podify",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();

  const { email, link } = options;

  const message =
    "We just received a request that you forgot your password. No problem you can use the link below and create brand new password.";

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Reset Password Link",
    html: generateTemplate({
      title: "Forget Password",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};

export const sendPassResetSuccessEmail = async (
  name: string,
  email: string
) => {
  const transport = generateMailTransporter();

  const message = `Dear ${name} we just updated your new password. You can now sign in with your new password.`;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Password Reset Successfully",
    html: generateTemplate({
      title: "Password Reset Successfully",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: SIGN_IN_URL,
      btnTitle: "Log in",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};


interface TicketConfirmationOptions {
  email: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketQuantity: number;
  qrCodeLink: string;
}


export const sendTicketConfirmationEmail = async (
  options: TicketConfirmationOptions
) => {
  const transport = generateMailTransporter();

  const {
    email,
    eventTitle,
    eventDate,
    eventLocation,
    ticketQuantity,
    qrCodeLink,
  } = options;

  const message = `Thank you for purchasing tickets to ${eventTitle}! Below are your event details:
  - Date: ${eventDate}
  - Location: ${eventLocation}
  - Quantity: ${ticketQuantity}

  Please find your QR code attached.`;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: `Your Ticket Confirmation for ${eventTitle}`,
    html: generateTemplate({
      title: `Ticket Confirmation: ${eventTitle}`,
      message,
      logo: "cid:logo",
      banner: "cid:event_banner",
      link: qrCodeLink,
      btnTitle: "View QR Code",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "event_banner.png",
        path: path.join(__dirname, "../mail/event_banner.png"),
        cid: "event_banner",
      },
    ],
  });
};
