import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as Sinon from 'sinon';
import { describe } from 'mocha';
import { app } from '../app';
import User from '../database/models/User.model';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test the login route', () => {
  describe('POST /login', () => {
    let obj = {
      email: 'user@user.com',
      password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
    };
    beforeEach(() => {
      obj = {
        email: 'user@user.com',
        password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
      }
      Sinon.restore();
    })
    it('returns an error if no email is passed', async () => {
      obj.email = '';
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property('message', 'All fields must be filled');
    })
    it('returns an error if no password is passed', async () => {
      obj.password = '';
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message', 'All fields must be filled');
    })
    it('returns an error if the email is wrong', async () => {
      obj.email = '1234';
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property('message', 'Incorrect email or password');
    })
    it('returns an error if the password is wrong', async () => {
      obj.password = '1234';
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property('message', 'Incorrect email or password');
    })
    it('returns a token if the information is correct', async () => {
      Sinon.stub(User, 'findOne').resolves(obj as User);
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response.body).to.have.property('token');
    })
    it('verification returns the role', async () => {
      Sinon.stub(User, 'findOne').resolves(obj as User);
      const res = await chai.request(app)
        .post('/login')
        .send(obj);
      const response = await chai.request(app)
        .post('/login/verification')
        .auth(res.body.token, { type: 'bearer' })
        .send(obj);
      expect(response.body).to.have.property('role');
    })
  })
})
