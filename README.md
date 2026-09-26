# Ayush Grover — Portfolio

Personal site: a scroll-driven 3D portfolio. The camera moves around an abstract
"answer engine" centerpiece as the resume and work slide past.

Adapted from [dayinji/sen-3d-resume](https://github.com/dayinji/sen-3d-resume) (MIT —
see LICENSE / NOTICE). The Pixar-style GLB character and its baked camera clip were
replaced with a procedural centerpiece (icosahedron core + orbit rings + satellites +
dust) and a keyframed camera rig; the scroll engine, post-processing, noise overlay and
UI structure are adapted from the original. Content, copy and palette are Ayush's.

## Dev

```bash
npm install
npm run dev
npm run build
```

Vite + React + react-three-fiber. Deploys on Vercel.
