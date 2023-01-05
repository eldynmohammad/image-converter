<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import UploadIcon from "~icons/fa6-solid/cloud-arrow-up";
import HeaderComponent from "./components/HeaderComponent.vue";
import ConvertedItem from "./components/ConvertedItem.vue";
import FooterComponent from "./components/FooterComponent.vue";

const imagePreview = ref("");
const canvasRef = ref();
const canvasImage = ref("");
const images = ref([]);
const convertTo = ref("png");
const currentProgress = ref("0%");
const fileSize = ref(0);

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

const handleEvent = (event) => {
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
                to: `To ${convertTo.value}`,
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
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <HeaderComponent />
        <div class="px-6 flex-1">
            <div
                class="max-w-4xl p-6 mx-auto my-8 sm:my-16 bg-white rounded-3xl"
            >
                <div class="flex justify-center">
                    <div class="flex text-sm font-semibold">
                        <button
                            class="px-4 py-2 rounded-l-lg"
                            :class="[
                                convertTo === 'png'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-600',
                            ]"
                            @click.stop="switchConvert('png')"
                        >
                            jpeg-to-png
                        </button>
                        <button
                            class="px-4 py-2 rounded-r-lg"
                            :class="[
                                convertTo === 'jpeg'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-600',
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
                                Upload preview
                                <span
                                    class="text-xs normal-case opacity-70 font-normal"
                                >
                                    (Your image won't be stored anywhere)
                                </span>
                            </label>
                            <button
                                v-if="imagePreview"
                                class="px-4 py-1 text-xs font-semibold text-gray-100 duration-300 border rounded-full bg-rose-400 hover:opacity-75"
                                @click.stop="clear"
                                aria-label="Clear everything"
                            >
                                Delete
                            </button>
                        </div>

                        <div
                            class="relative mt-2 overflow-hidden border-4 border-gray-300 border-dashed bg-gray-100 rounded-2xl group hover:bg-gray-200 custom-animation"
                        >
                            <input
                                name="image-form"
                                @change="uploadFile"
                                type="file"
                                class="absolute inset-0 z-10 outline-none opacity-0 cursor-pointer"
                                :accept="
                                    convertTo === 'png'
                                        ? 'image/jpeg'
                                        : 'image/png'
                                "
                                placeholder="Lorem Pisum"
                            />
                            <div
                                v-if="imagePreview"
                                class="relative grid place-content-center"
                            >
                                <img
                                    :src="imagePreview"
                                    class="object-contain w-auto h-full max-h-96 shadow-xl"
                                />
                                <div
                                    class="absolute top-0 left-0 text-xs bg-secondary px-4 py-2.5 rounded-br-xl pointer-events-none"
                                >
                                    <span class="text-gray-800/50">
                                        Click the image to change
                                    </span>
                                </div>
                            </div>
                            <div
                                v-else
                                class="flex flex-col py-[133px] justify-center items-center"
                            >
                                <UploadIcon class="text-primary text-7xl" />
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
                        <div class="mt-3 space-y-4">
                            <ConvertedItem
                                v-for="(item, index) in images"
                                :key="index"
                                :item="item"
                                :index="index"
                            />
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <FooterComponent />
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
