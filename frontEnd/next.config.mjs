/** @type {import('next').NextConfig} */
const nextConfig = {
    output:"export",
    typescript:{
        ignoreBuildErrors:true
    },
    compiler: {
        styledComponents: true,
    },
    webpack: (config) => {
        config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work
        return config;
    },

};

export default nextConfig;
