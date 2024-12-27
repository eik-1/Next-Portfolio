"use client"

import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import React, { useEffect, useRef } from "react"
import * as THREE from "three"

export default function Ethereum() {
    const groupRef = useRef()
    const { camera } = useThree()
    const { nodes, materials } = useGLTF("/ethereum.gltf")

    useEffect(() => {
        if (groupRef.current) {
            const box = new THREE.Box3().setFromObject(groupRef.current)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const fov = camera.fov * (Math.PI / 180)
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
            cameraZ *= 1.4
            camera.position.set(center.x, center.y, cameraZ)
            camera.rotation.y = Math.PI / 2
            camera.updateProjectionMatrix()
            groupRef.current.rotation.x = -Math.PI / 2
        }
    }, [camera])

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.z += 0.01
        }
    })

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableDamping={true}
                dampingFactor={0.25}
                rotateSpeed={1}
            />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <group ref={groupRef} dispose={null}>
                <mesh
                    geometry={nodes.Object_2.geometry}
                    material={materials.default}
                />
            </group>
        </>
    )
}

useGLTF.preload("/ethereum.gltf")
