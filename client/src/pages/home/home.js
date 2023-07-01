import { useParams, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-5 w-75 justify-content-center align-items-center bg-dark m-auto">
        <div>
          <button className="btn btn-primary mx-3">Login</button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('consent')}
          >
            Sign-up
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
