import React, { Suspense, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { pb, useConfiguratorStore } from "../store";
import { Asset } from "./Asset";

export function Avatar({ ...props }) {
  const group = useRef();
  const { nodes } = useGLTF("/models/Armature.glb");
  //   const { actions } = useAnimations(animations, group);
  const customization = useConfiguratorStore((state) => state.customization);

  console.log(nodes);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          {Object.keys(customization).map(
            (key) =>
              customization[key]?.asset?.url && (
                <Suspense key={customization[key].asset.id}>
                  <Asset
                    url={pb.files.getUrl(
                      customization[key].asset,
                      customization[key].asset.url
                    )}
                    skeleton={nodes.Plane.skeleton}
                  ></Asset>
                </Suspense>
              )
          )}
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/Armature.glb");
