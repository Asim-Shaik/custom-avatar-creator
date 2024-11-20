import { NodeIO } from "@gltf-transform/core";
import { dedup, draco, prune, quantize } from "@gltf-transform/functions";
import React, { Suspense, useEffect, useRef } from "react";
import { useGLTF, useAnimations, useFBX } from "@react-three/drei";
import { pb, useConfiguratorStore } from "../store";
import { Asset } from "./Asset";
import { GLTFExporter } from "three-stdlib";

export function Avatar({ ...props }) {
  const group = useRef();
  const { nodes } = useGLTF("/models/Armature.glb");
  const { animations } = useFBX("/models/Idle.fbx");
  const { actions } = useAnimations(animations, group);
  const customization = useConfiguratorStore((state) => state.customization);
  const setDownload = useConfiguratorStore((state) => state.setDownload);

  useEffect(() => {
    function download() {
      const exporter = new GLTFExporter();
      exporter.parse(
        group.current,
        async function (result) {
          const io = new NodeIO();

          // Read.
          const document = await io.readBinary(new Uint8Array(result)); // Uint8Array → Document
          await document.transform(
            // Remove unused nodes, textures, or other data.
            prune(),
            // Remove duplicate vertex or texture data, if any.
            dedup(),
            // Compress mesh geometry with Draco.
            draco(),
            // Quantize mesh geometry.
            quantize()
          );

          // Write.
          const glb = await io.writeBinary(document); // Document → Uint8Array

          save(
            new Blob([glb], { type: "application/octet-stream" }),
            `avatar_${+new Date()}.glb`
          );
        },
        function (error) {
          console.error(error);
        },
        { binary: true }
      );
    }

    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link); // Firefox workaround, see #6594

    function save(blob, filename) {
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }
    setDownload(download);
  }, []);

  useEffect(() => {
    actions["mixamo.com"]?.play();
  }, [actions]);

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
                    categoryName={key}
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
