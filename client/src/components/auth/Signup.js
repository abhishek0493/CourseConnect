import './signup.css';
import vector from './signup2.jpg';

const Signup = (props) => {
  const arrData = Object.entries(props);
  // console.log(arrData);
  return (
    <section className="signup-super row p-4 m-5">
      <div className="image-box col-md-6 p-3">
        <img src={vector} className="illustration" />
      </div>
      <div className="sign-up-form col-md-6 p-3">
        <h1 className="mb-4">Signup</h1>
        <form className="row g-3">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input type="text" className="form-control" id="name" />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputPassword4" className="form-label">
              Email
            </label>
            <input type="email" className="form-control" id="inputPassword4" />
          </div>
          <div className="col-6">
            <label htmlFor="inputAddress" className="form-label">
              Password
            </label>
            <input type="password" className="form-control" id="password" />
          </div>
          <div className="col-6">
            <label htmlFor="inputAddress" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirm_password"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputState" className="form-label">
              Profession
            </label>
            <select id="inputState" className="form-select">
              {arrData.map((item, index) => {
                <option>{item[1].name}</option>;
              })}
              {/* <option>Student</option>
              <option>Instrutor/Professor</option>
              <option>Working Professional</option> */}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="inputCity" className="form-label">
              University/Company Name (Optional)
            </label>
            <input type="text" className="form-control" id="inputCity" />
          </div>
          <div className="col-12">
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
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signup;
