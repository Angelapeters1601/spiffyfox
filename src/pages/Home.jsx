import spiffyLogo from "../assets/spiffyLogo2.jpg";

const Home = () => {
  return (
    <div className="flex min-h-100 items-center justify-center p-4">
      <div className="text-center">
        <img
          src={spiffyLogo}
          alt="spiffy logo"
          className="h-30 w-100 rounded-2xl"
        />
      </div>
    </div>
  );
};

export default Home;
