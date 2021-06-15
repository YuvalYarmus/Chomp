import * as THREE from "three";
import React, { useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useEffect } from "react";


const CubeScene: React.FC = () => {
  const set = useThree((state) => state.set);
  const size = useThree((state) => state.size);
  const scene = useThree((state) => state.scene);

  const cube = useRef<THREE.Mesh>();

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      70,
      size.width / size.height,
      0.01,
      10
    );

    camera.position.z = 1;

    scene.background = new THREE.Color("rgb(0, 0, 0)");

    set({ camera });
  }, []);

  useFrame(({ clock }, deltaTime) => {
    const deltaHeight =
      Math.sin(clock.elapsedTime + deltaTime) - Math.sin(clock.elapsedTime);

    cube.current!.position.y += deltaHeight * 0.05;
    cube.current!.rotation.y -= deltaTime * 20 * (Math.PI / 180);
  });

  return (
    <>
      <hemisphereLight
        color={new THREE.Color("hsl(216, 100%, 60%)")}
        groundColor={new THREE.Color("hsl(34, 100%, 75%)")}
        intensity={0.6}
        position={[0, 50, 0]}
      ></hemisphereLight>
      <directionalLight
        position={[-30, 52.5, 30]}
        color={new THREE.Color("hsl(36, 100%, 95%)")}
        castShadow
        shadowMapHeight={2048}
        shadowMapWidth={2048}
        shadowCameraLeft={-5}
        shadowCameraRight={5}
        shadowCameraTop={5}
        shadowCameraBottom={-5}
        shadowCameraFar={3500}
        shadowBias={-0.0001}
      />
      <mesh castShadow receiveShadow ref={cube}>
        <boxGeometry args={[0.2, 0.2, 0.2]}></boxGeometry>
        <meshStandardMaterial color={0xffffff}></meshStandardMaterial>
      </mesh>
    </>
  );
};

export default function LoadingCube({className} : Props) {
  return (
    <Canvas className={className}>
      <CubeScene />
    </Canvas>
  );
}

type Props = {
  className: string;
}