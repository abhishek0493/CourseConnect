import './signup.css';
import vector from './images/7606000.jpg';

const Signup = (props) => {
  return (
    <section className="signup-super row p-5 m-5">
      <div className="image-box col-md-6 p-3 text-center">
        <img src={vector} className="illustration" />
        <a
          href="https://www.freepik.com/free-vector/college-project-concept-illustration_29659818.htm#query=education%20illustration&position=3&from_view=keyword&track=ais"
          className="attribution"
        >
          Image by storyset
        </a>{' '}
        <span className="attribution">on Freepik</span>
      </div>
      <div className="sign-up-form col-md-6 p-3">
        <h1 className="mb-4">Create an account</h1>
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
              <option>--- Select ---</option>
              {Object.values(props.userTypes).map((value) => (
                <option key={value.type_id} value={value.type_id}>
                  {value.name}
                </option>
              ))}
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
              Create account
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signup;
