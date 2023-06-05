import './signup.css';
import { useState } from 'react';
import vector from './images/7606000.jpg';
import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/',
// });

const Signup = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 0,
  });

  const [validationError, setValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    await axios
      .post('http://localhost:8000/api/v1/auth/signUp', formData)
      .then((res) => {})
      .catch((err) => {
        const response = err.response;
        if (!response.data.success) {
          console.log(response.data.message);
          setValidationError(true);
          setValidationMessage(response.data.message);
        }
        console.log(err);
      });
  };

  return (
    <section className="signup-super row p-5 m-5">
      <div className="image-box col-md-6 text-center">
        <img src={vector} className="illustration" />
        <a
          href="https://www.freepik.com/free-vector/college-project-concept-illustration_29659818.htm#query=education%20illustration&position=3&from_view=keyword&track=ais"
          className="attribution"
        >
          Image by storyset
        </a>{' '}
        <span className="attribution">on Freepik</span>
        <h5 className="mt-2 p-3 text-dark">
          "Discover, Connect & Learn together"
        </h5>
      </div>
      <div className="sign-up-form col-md-6 p-3">
        <h1 className="mb-4">Create an account</h1>
        <form className="row g-3" onSubmit={handleSignUp}>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="emailId"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="profession" className="form-label">
              Profession
            </label>
            <select
              id="user_type"
              className="form-select"
              name="user_type"
              onChange={handleChange}
            >
              <option value="0">--- Select ---</option>
              {Object.values(props.userTypes).map((value) => (
                <option key={value.type_id} value={value.type_id}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-12">
            <label htmlFor="inputCity" className="form-label">
              University/Company Name (Optional)
            </label>
            <input
              type="text"
              className="form-control"
              id="type_value"
              name="type_value"
            />
          </div>
          <div className="col-6">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="col-6">
            <label htmlFor="confirm_password" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirm_password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {/* <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="gridCheck"
              />
              <label className="form-check-label" htmlFor="gridCheck">
                Give Consent
              </label>
            </div>
          </div> */}
          <div
            className={
              validationError
                ? 'alert alert-danger'
                : 'd-none alert alert-danger'
            }
            id="alert-box"
            role="alert"
          >
            {validationMessage}
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary mt-2">
              Create account
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signup;
