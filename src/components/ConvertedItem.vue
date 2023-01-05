<script setup>
import Swal from "sweetalert2";
import FileIcon from "~icons/fa6-solid/file-lines";
import DownloadIcon from "~icons/fa6-solid/floppy-disk";

const props = defineProps({
    item: Object,
    index: Number,
});

const downloadImage = (image) => {
    if (image) {
        let link = document.createElement("a");
        link.download = `converted-image`;
        link.href = image;
        link.click();
    } else {
        Toast.fire({
            icon: "error",
            title: "No Image found",
        });
    }
};
</script>

<template>
    <div class="p-6 bg-gray-200 rounded-xl">
        <div class="flex justify-between">
            <div class="flex">
                <FileIcon class="text-5xl text-secondary" />
                <div class="ml-4">
                    <p class="font-semibold">
                        {{ props.index + 1 }} - Your file is ready
                    </p>
                    <p class="text-xs opacity-70">
                        {{ props.item.to }}
                    </p>
                    <p class="mt-1 text-sm">
                        {{ Math.floor(props.item.size / 1000) }}
                        KB
                    </p>
                </div>
            </div>
            <button
                class="flex items-center gap-2 flex-shrink-0 px-4 py-2 text-sm text-white bg-primary hover:bg-secondary rounded-full h-max"
                @click.stop="downloadImage(props.item.img, props.item.name)"
            >
                <DownloadIcon />
                <span> Download </span>
            </button>
        </div>
    </div>
</template>
