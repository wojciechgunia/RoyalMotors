<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useRenderLoop, useTresContext } from '@tresjs/core'

const isLeftClick = ref(false)

const { camera, renderer } = useTresContext()
const controls = ref<OrbitControls>()
const orbitVal = ref<OrbitControls>()

function resetOrbit() {
  controls.value?.reset()
  initControl()
}

defineExpose({
  resetOrbit,
})

const initControl = () => {
  if (!camera.value || !renderer.value) return

  const domEl = renderer.value.domElement
  const orbit = new OrbitControls(camera.value, domEl)
  orbit.enablePan = false
  orbit.enableZoom = false
  orbit.enableRotate = true
  orbit.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: null,
    RIGHT: null,
  }
  orbit.minDistance = 120
  orbit.target.set(0, 50, 0)
  controls.value = orbit
  orbitVal.value = orbit

  domEl.addEventListener('contextmenu', (e) => e.preventDefault())

  domEl.addEventListener('mousedown', (e) => {
    if (e.button === 0) isLeftClick.value = true // LPM
  })
  domEl.addEventListener('mouseup', () => {
    isLeftClick.value = false
  })

  domEl.addEventListener(
    'wheel',
    (e) => {
      if (isLeftClick.value) {
        e.preventDefault()
        const delta = e.deltaY
        const zoomSpeed = -0.05
        const direction = delta > 0 ? 1 : -1

        const cam = camera.value
        const dir = new THREE.Vector3()
        cam?.getWorldDirection(dir)
        cam?.position.addScaledVector(
          dir,
          direction * zoomSpeed * cam.position.distanceTo(controls.value!.target),
        )
      }
    },
    { passive: false },
  )
}

onMounted(initControl)

useRenderLoop().onLoop(() => {
  controls.value?.update()
})
</script>

<style scoped lang="scss"></style>
