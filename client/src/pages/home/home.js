import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="container-fuild m-5 p-5">
        <div class="d-grid gap-2">
          <Link to="/consent" class="btn btn-primary" type="button">
            Sign-up
          </Link>
          <Link to="/signup" class="btn btn-primary" type="button">
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
