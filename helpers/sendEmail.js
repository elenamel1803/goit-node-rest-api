import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_EMAIL_FROM, UKR_NET_PASSWORD } = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL_FROM,
    pass: UKR_NET_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export const sendEmail = (data) => {
  const emailOptions = { ...data, from: UKR_NET_EMAIL_FROM };
  return transporter.sendMail(emailOptions);
};
