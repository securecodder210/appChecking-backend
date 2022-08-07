const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());

const AddApp = require("./app.model");
const MineApp = require("./mineApp.model");
const { getMaxListeners } = require("process");

//mongodb connection
mongoose.connect(
  `mongodb+srv://securecodder210:sc210@cluster-0.4ly0u.mongodb.net/appdb`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("MONGO: successfully connected to db");
});

app.get("/", (req, res) => {
  return res.status(200).json({ status: true, message: "App is Running..." });
});

//start the server
app.listen(process.env.PORT || 5000, async () => {
  console.log("Magic happens on port " + process.env.PORT || 5000);

  setInterval(() => {
    // for other app
    (async function () {
      try {
        const app = await AddApp.find();
        // console.log(app)
        if (app.length > 0) {
          await app.map(async (data) => {
            axios
              .get(
                `https://play.google.com/store/apps/details?id=${data.packageName}`
              )
              .then(async (res) => {
                console.log(res.status);
                if (res.status !== 200) {
                  console.log("send mail in then", data.appLogo);
                  sendEmail({
                    image: data.appLogo,
                    name: data.appName,
                    packageName: data.packageName,
                    playStoreURL: `https://play.google.com/store/apps/details?id=${data.packageName}`,
                  });
                } else {
                  console.log("Success! ", data.appName);
                }
              })
              .catch(async (error) => {
                // console.log(error)
                sendEmailForApp({
                  image: data.appLogo,
                  name: data.appName,
                  packageName: data.packageName,
                  playStoreURL: `https://play.google.com/store/apps/details?id=${data.packageName}`,
                });
              });
          });
        }
      } catch (error) {
        console.log(error);
      }
    })();

    const sendEmailForApp = async (data) => {
      try {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "securecodder210@gmail.com",
            pass: "lcwtnngxakobshpu",
          },
        });

        var tab = "";
        tab += "<!DOCTYPE html><html><head>";
        tab +=
          "<meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'>";
        tab += "<style type='text/css'>";
        tab +=
          " @media screen {@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 400;}";
        tab +=
          "@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 700;}}";
        tab +=
          "body,table,td,a {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }";
        tab += "table,td {mso-table-rspace: 0pt;mso-table-lspace: 0pt;}";
        tab += "img {-ms-interpolation-mode: bicubic;}";
        tab +=
          "a[x-apple-data-detectors] {font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height:inherit !important;color: inherit !important;text-decoration: none !important;}";
        tab += "div[style*='margin: 16px 0;'] {margin: 0 !important;}";
        tab +=
          "body {width: 100% !important;height: 100% !important;padding: 0 !important;margin: 0 !important;}";
        tab += "table {border-collapse: collapse !important;}";
        tab += "a {color: #1a82e2;}";
        tab +=
          "img {height: auto;line-height: 100%;text-decoration: none;border: 0;outline: none;}";
        tab += "</style></head><body>";
        tab +=
          "<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
        tab +=
          "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>";
        tab +=
          "<tr><td align='center' valign='top' bgcolor='#ffffff' style='padding:36px 24px 0;border-top: 3px solid #d4dadf;'><a href='#' target='_blank' style='display: inline-block;'>";
        tab +=
          "<img src='https://digiapp.digicean.com/" +
          data.image +
          "' alt='Logo' border='0' width='48' style='display: inline; width: 90px; max-width: 90px; min-width: 90px;'></a>";
        tab +=
          "</td></tr></table></td></tr><tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff'>";
        tab +=
          "<h1 style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'>" +
          data.name +
          "</h1></td></tr></table></td></tr>";
        tab +=
          "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff' style='padding: 24px; font-size: 16px; line-height: 24px;font-weight: 600'>";
        tab +=
          "<p style='margin: 0;'><br />Package Name: " +
          data.packageName +
          "</p></td></tr><tr><td align='left' bgcolor='#ffffff'>";
        tab +=
          "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' bgcolor='#ffffff' style='padding: 12px;'>";
        tab +=
          "<table border='0' cellpadding='0' cellspacing='0'><tr><td align='center' style='border-radius: 4px;padding-bottom: 50px;'>";
        tab +=
          "<a href='" +
          data.playStoreURL +
          "' target='_blank' style='display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;background: #FE9A16; box-shadow: -2px 10px 20px -1px #33cccc66;'>PLAY STORE LINK</a>";
        tab +=
          "</td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>";

        var mailOptions = {
          from: "securecodder210@gmail.com",
          to: "codderlab@gmail.com",
          subject: "Action Required, App Not Found",
          html: tab,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("mail sent successfully for app");
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    // for mine apps
    (async function () {
      try {
        const mineApp = await MineApp.find();
        // console.log(mineApp)
        if (mineApp.length > 0) {
          await mineApp.map(async (data) => {
            axios
              .get(
                `https://play.google.com/store/apps/details?id=${data.packageName}`
              )
              .then(async (res) => {
                console.log(res.status);
                if (res.status !== 200) {
                  console.log("send mail in then", data.appLogo);
                  sendEmail({
                    image: data.appLogo,
                    name: data.appName,
                    packageName: data.packageName,
                    playStoreURL: `https://play.google.com/store/apps/details?id=${data.packageName}`,
                  });
                } else {
                  console.log("Success! ", data.appName);
                }
              })
              .catch(async (error) => {
                // console.log(error)
                sendEmailForMineApp({
                  image: data.appLogo,
                  name: data.appName,
                  packageName: data.packageName,
                  playStoreURL: `https://play.google.com/store/apps/details?id=${data.packageName}`,
                });
              });
          });
        }
      } catch (error) {
        console.log(error);
      }
    })();

    const sendEmailForMineApp = async (data) => {
      try {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "securecodder210@gmail.com",
            pass: "lcwtnngxakobshpu",
          },
        });

        var tab = "";
        tab += "<!DOCTYPE html><html><head>";
        tab +=
          "<meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'>";
        tab += "<style type='text/css'>";
        tab +=
          " @media screen {@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 400;}";
        tab +=
          "@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 700;}}";
        tab +=
          "body,table,td,a {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }";
        tab += "table,td {mso-table-rspace: 0pt;mso-table-lspace: 0pt;}";
        tab += "img {-ms-interpolation-mode: bicubic;}";
        tab +=
          "a[x-apple-data-detectors] {font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height:inherit !important;color: inherit !important;text-decoration: none !important;}";
        tab += "div[style*='margin: 16px 0;'] {margin: 0 !important;}";
        tab +=
          "body {width: 100% !important;height: 100% !important;padding: 0 !important;margin: 0 !important;}";
        tab += "table {border-collapse: collapse !important;}";
        tab += "a {color: #1a82e2;}";
        tab +=
          "img {height: auto;line-height: 100%;text-decoration: none;border: 0;outline: none;}";
        tab += "</style></head><body>";
        tab +=
          "<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
        tab +=
          "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>";
        tab +=
          "<tr><td align='center' valign='top' bgcolor='#ffffff' style='padding:36px 24px 0;border-top: 3px solid #d4dadf;'><a href='#' target='_blank' style='display: inline-block;'>";
        tab +=
          "<img src='https://mineapp.classicube.in/" +
          data.image +
          "' alt='Logo' border='0' width='48' style='display: inline; width: 90px; max-width: 90px; min-width: 90px;'></a>";
        tab +=
          "</td></tr></table></td></tr><tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff'>";
        tab +=
          "<h1 style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'>" +
          data.name +
          "</h1></td></tr></table></td></tr>";
        tab +=
          "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff' style='padding: 24px; font-size: 16px; line-height: 24px;font-weight: 600'>";
        tab +=
          "<p style='margin: 0;'><br />Package Name: " +
          data.packageName +
          "</p></td></tr><tr><td align='left' bgcolor='#ffffff'>";
        tab +=
          "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' bgcolor='#ffffff' style='padding: 12px;'>";
        tab +=
          "<table border='0' cellpadding='0' cellspacing='0'><tr><td align='center' style='border-radius: 4px;padding-bottom: 50px;'>";
        tab +=
          "<a href='" +
          data.playStoreURL +
          "' target='_blank' style='display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;background: #FE9A16; box-shadow: -2px 10px 20px -1px #33cccc66;'>PLAY STORE LINK</a>";
        tab +=
          "</td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>";

        var mailOptions = {
          from: "securecodder210@gmail.com",
          to: "codderlab@gmail.com",
          subject: "Action Required, MineApp Not Found",
          html: tab,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("mail sent successfully for MineApp");
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    axios.get("https://appchecking-backend.herokuapp.com/");
  }, 1200000);
});
