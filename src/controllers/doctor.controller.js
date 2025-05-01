import Doctor from '../models/doctor.model.js';
import { catchError } from '../utils/error-response.js';
import { doctorValidator } from '../validation/doctor.validation.js';
import { otpGenerator } from '../utils/otp-generator.js';
import { getCache, setCache } from '../utils/cache.js';
import { refTokenWriteCookie } from '../utils/write-cookie.js';
import {
  generateAccessToekn,
  generateRefreshToekn,
} from '../utils/generate-token.js';

export class DoctorController {
  async createDoctor(req, res) {
    try {
      const { error, value } = doctorValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const existPhone = await Doctor.findOne({
        phoneNumber: value.phoneNumber,
      });
      if (existPhone) {
        return catchError(res, 409, 'Phone number already exist');
      }
      const doctor = await Doctor.create(value);
      return res.status(201).json({
        statusCode: 201,
        message: 'succuss',
        data: doctor,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async signinDoctor(req, res) {
    try {
      const { phoneNumber } = req.body;
      const doctor = await Doctor.findOne({ phoneNumber });
      if (!doctor) {
        return catchError(res, 404, 'Doctor not found');
      }

      const otp = otpGenerator();
      const mailMessage = {
        from: process.env.SMTP_USER,
        to: 'dilshod7861@gmail.com',
        subject: 'e-navbat',
        text: otp,
      };
      setCache(phoneNumber, otp);
      return res.status(200).json({
        statusCode: 200,
        message: 'succuss',
        data: otp,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async confirmSigninDoctor(req, res) {
    try {
      const { phoneNumber, otp } = req.body;
      const doctor = await Doctor.findOne({ phoneNumber });
      if (!doctor) {
        return catchError(res, 400, 'Wrong phone number');
      }
      const otpCache = getCache(phoneNumber);
      if (!otpCache || otpCache !== otp) {
        return catchError(res, 400, 'OTP expired');
      }
      const payload = { id: doctor._id, is_doctor: true };
      const accessToken = generateAccessToekn(payload);
      const refreshToken = generateRefreshToekn(payload);
      refTokenWriteCookie(res, 'refreshTokenDoctor', refreshToken);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: accessToken,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async signOutDoctor(req, res) {
    try {
      const refreshToken = req.cookies.refreshTokenDoctor;
      if (!refreshToken) {
        return catchError(res, 401, 'Refresh token doctor not found');
      }
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        return catchError(res, 401, 'Refresh token doctor expired');
      }
      res.clearCookie('refreshTokenDoctor');
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async accessTokenDoctor(req, res) {
    try {
      const refreshToken = req.cookies.refreshTokenDoctor;
      if (!refreshToken) {
        return catchError(res, 401, 'Refresh token doctor not found');
      }
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        return catchError(res, 401, 'Refresh token doctor expired');
      }
      const payload = { id: decodedToken.id, role: decodedToken.role };
      const accessToken = generateAccessToekn(payload);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: accessToken,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
  static async findDoctorById(res, id) {
    try {
      await Doctor;
    } catch (error) {}
  }
}
