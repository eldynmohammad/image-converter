<script setup>
import { ref } from "vue";
import FileIcon from "~icons/fa6-solid/file-lines";
import DownloadIcon from "~icons/fa6-solid/floppy-disk";
import UploadIcon from "~icons/fa6-solid/cloud-arrow-up";
// import Swal from "sweetalert2";

const imagePreview = ref("");
const canvasRef = ref();
const canvasImage = ref("");
const images = ref([]);
const convertTo = ref("png");
const currentProgress = ref("0%");
const fileSize = ref(0);

// const Toast = Swal.mixin({
//     toast: true,
//     position: "top-end",
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//         toast.addEventListener("mouseenter", Swal.stopTimer);
//         toast.addEventListener("mouseleave", Swal.resumeTimer);
//     },
// });

const handleEvent = (event) => {
    console.log(event);
    if (["loadend", "load"].includes(event.type)) {
        imagePreview.value = event.target.result;

        const newImage = new Image();
        newImage.src = imagePreview.value;
        newImage.onload = () => {
            const newCanvas = canvasRef.value;
            const newContext = newCanvas.getContext("2d");
            newCanvas.width = newImage.width;
            newCanvas.height = newImage.height;
            newContext.drawImage(newImage, 0, 0);
            if (convertTo.value === "jpeg")
                canvasImage.value = canvasRef.value.toDataURL("image/jpeg", 1);
            else if (convertTo.value === "png")
                canvasImage.value = canvasRef.value.toDataURL("image/png");

            const obj = {
                size: event.loaded,
                img: canvasImage.value,
            };
            images.value.push(obj);
        };
    }

    if (event.type === "progress") {
        currentProgress.value = `${(event.loaded / event.total) * 100}%`;
    }
};

const addListener = (reader) => {
    reader.addEventListener("loadstart", handleEvent);
    reader.addEventListener("loadend", handleEvent);
    reader.addEventListener("progress", handleEvent);
    reader.addEventListener("error", handleEvent);
    reader.addEventListener("abort", handleEvent);
};

const uploadFile = (event) => {
    let selectedFile = event.target.files[0];
    if (selectedFile) {
        const reader = new FileReader();
        addListener(reader);
        reader.readAsDataURL(selectedFile);
    }
};

const switchConvert = (val) => (convertTo.value = val);

const clear = () => {
    imagePreview.value = "";
    canvasImage.value = "";
};

const downloadImage = (image) => {
    let link = document.createElement("a");
    link.download = `converted-image`;
    link.href = image;
    link.click();
};
</script>

<template>
    <header class="flex items-center h-20 bg-white">
        <nav class="w-full max-w-4xl p-6 mx-auto font-semibold">
            <div class="text-xl">
                <span>Image</span>
                <span class="text-indigo-500">Converter</span>
            </div>
        </nav>
    </header>
    <div
        class="w-full max-w-3xl p-8 mx-auto my-8 text-gray-800 bg-white shadow-xl rounded-xl"
    >
        <div class="flex justify-center">
            <div class="flex text-sm font-semibold">
                <button
                    class="px-4 py-2 rounded-l-lg"
                    :class="[
                        convertTo === 'png'
                            ? 'bg-indigo-400 text-white'
                            : 'bg-gray-100 ',
                    ]"
                    @click.stop="switchConvert('png')"
                >
                    jpeg-to-png
                </button>
                <button
                    class="px-4 py-2 rounded-r-lg"
                    :class="[
                        convertTo === 'jpeg'
                            ? 'bg-indigo-400 text-white'
                            : 'bg-gray-100 ',
                    ]"
                    @click.stop="switchConvert('jpeg')"
                >
                    png-to-jpeg
                </button>
            </div>
        </div>
        <div class="flex flex-col mt-8">
            <div class="flex-shrink-0 w-full sm:flex-1">
                <div class="flex items-center justify-between">
                    <label
                        class="block text-xs uppercase tracking-wider font-semibold text-gray-500 px-1.5 py-2"
                    >
                        Upload
                    </label>
                    <button
                        v-if="imagePreview"
                        class="px-4 py-1 text-xs font-semibold text-gray-100 duration-300 border rounded-full bg-rose-500 hover:opacity-75"
                        @click.stop="clear"
                        aria-label="Clear everything"
                    >
                        Delete
                    </button>
                </div>

                <div
                    class="relative mt-2 overflow-hidden border-4 border-gray-300 border-dashed bg-gray-50 rounded-2xl group hover:bg-gray-200 custom-animation"
                >
                    <input
                        name="image-form"
                        @change="uploadFile"
                        type="file"
                        class="absolute inset-0 z-10 outline-none opacity-0 cursor-pointer"
                        :accept="
                            convertTo === 'png' ? 'image/jpeg' : 'image/png'
                        "
                        placeholder="Lorem Pisum"
                    />
                    <div
                        v-if="imagePreview"
                        class="relative grid place-content-center"
                    >
                        <img
                            :src="imagePreview"
                            class="object-contain w-auto h-full max-h-96"
                        />
                        <div
                            class="absolute top-0 left-0 text-xs bg-gray-800/40 px-4 py-2.5 rounded-br-xl pointer-events-none"
                        >
                            <span class="text-white opacity-75">
                                Click the image to change
                            </span>
                        </div>
                    </div>
                    <div
                        v-else
                        class="flex flex-col py-[133px] justify-center items-center"
                    >
                        <UploadIcon class="text-indigo-400 text-7xl" />
                        <p
                            class="w-full mt-4 text-xs tracking-wider text-center uppercase opacity-60"
                        >
                            Click here to upload an image
                        </p>
                    </div>
                </div>
            </div>
            <canvas ref="canvasRef" class="w-full h-0"></canvas>
            <template v-if="images.length">
                <div class="mt-6 flex justify-end">
                    <button
                        @click="images = []"
                        class="px-4 py-1 text-xs font-semibold duration-300 border rounded-full bg-slate-300 text-slate-600 hover:opacity-75"
                    >
                        Clear
                    </button>
                </div>
                <div class="mt-2 space-y-4">
                    <div
                        v-for="(item, index) in images"
                        :key="index"
                        class="p-6 bg-indigo-100 rounded-xl"
                    >
                        <div class="flex justify-between">
                            <div class="flex">
                                <FileIcon class="text-5xl text-indigo-300" />
                                <div class="ml-4">
                                    <p class="font-semibold">
                                        {{ index + 1 }} - Your file is ready
                                    </p>
                                    <p class="text-sm">
                                        {{ Math.floor(item.size / 1000) }} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                class="flex-shrink-0 px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-full h-max"
                                @click.stop="downloadImage(item.img, item.name)"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
