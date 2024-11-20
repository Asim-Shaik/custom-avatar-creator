import React from "react";
import { Avatar } from "./Avatar";
import { Environment, OrbitControls } from "@react-three/drei";

const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" environmentIntensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-5, 5, 5]} intensity={0.7} />

      <directionalLight position={[1, 0.1, -5]} intensity={3} color={"red"} />
      <directionalLight position={[-1, 0.1, -5]} intensity={8} color={"blue"} />

      <Avatar />
    </>
  );
};

export default Experience;
