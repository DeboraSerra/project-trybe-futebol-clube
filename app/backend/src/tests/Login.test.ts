import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import { app } from '../app';
import User from '../database/models/User.model';

chai.use(chaiHttp);

const { expect } = chai;

describe('Test the login route', () => {
  describe('POST /login', () => {
    let obj = {
      email: 'user@user.com',
      password: 'secret_user',
    };
    beforeEach(() => {
      obj = {
        email: 'user@user.com',
        password: 'secret_user',
      }
      sinon.restore();
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
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response.body).to.have.property('token');
    })
    it('verification returns the role', async () => {
      sinon.stub(User, 'findOne').resolves(obj as User);
      const res = await chai.request(app)
        .post('/login')
        .send(obj);
      console.log({
        status: res.status,
        body: res.body,
        text: res.text,
      })
      const response = await chai.request(app)
        .post('/login/verification')
        .auth(res.body.token, { type: 'bearer' })
        .send(obj);
      expect(response.body).to.have.property('role');
    })
  })
})
