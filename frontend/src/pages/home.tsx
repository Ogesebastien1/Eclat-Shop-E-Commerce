import Spline from "@splinetool/react-spline";

export const Home = () => {
  return (
    <div>
      <Spline
        scene="https://prod.spline.design/vTMA4rnfHpOsL65Q/scene.splinecode"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};
