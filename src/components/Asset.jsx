import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { useConfiguratorStore } from "../store";

export const Asset = ({ url, skeleton }) => {
  const { scene } = useGLTF(url);

  console.log(url, skeleton);

  const skin = useConfiguratorStore((state) => state.skin);

  const attachedItems = useMemo(() => {
    const items = [];

    scene.traverse((child) => {
      //   console.log(child, "--------");
      if (child.isMesh) {
        items.push({
          geometry: child.geometry,
          material: child.material.name.includes("Skin_")
            ? skin
            : child.material,
          morphTargetDictionary: child.morphTargetDictionary,
          morphTargetInfluences: child.morphTargetInfluences,
        });
      }
    });
    return items;
  }, [scene]);

  //   console.log(attachedItems);
  return attachedItems.map((item, index) => (
    <skinnedMesh
      key={index}
      geometry={item.geometry}
      material={item.material}
      skeleton={skeleton}
      castShadow
      recieveShadow
    />
  ));
};
