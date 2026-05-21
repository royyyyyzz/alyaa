const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');

async function getFileData(buffer) {
    const type = await fromBuffer(buffer);
    return {
        ext: type?.ext || 'jpg',
        mime: type?.mime || 'image/jpeg',
        filename: `image_${Date.now()}.${type?.ext || 'jpg'}`
    };
}

async function uguu(buffer) {
    try {
        const { filename } = await getFileData(buffer);
        const data = new FormData();

        data.append('files[]', buffer, { filename });

        const res = await axios.post('https://uguu.se/upload.php', data, {
            headers: {
                ...data.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                Referer: 'https://uguu.se/'
            },
            timeout: 60000
        });

        const fileUrl =
            res.data?.files?.[0]?.url ||
            res.data?.files?.[0];

        if (!fileUrl) throw new Error('Gagal upload gambar ke Uguu.');

        return fileUrl;
    } catch (err) {
        console.error('Uguu Error:', err?.response?.data || err.message);
        throw new Error('Gagal upload gambar ke temporary host.');
    }
}

async function createNanoBananaJob(image1, image2, prompt) {
    const url = 'https://omegatech-api.dixonomega.tech/api/ai/nanobana-pro-v3';

    const res = await axios.get(url, {
        params: {
            image1,
            image2,
            prompt
        },
        timeout: 60000
    });

    const data = res.data;

    if (!data?.success || !data?.task_id) {
        throw new Error(data?.message || 'Gagal membuat task Nano Banana.');
    }

    return data.task_id;
}

async function checkNanoBananaResult(taskId) {
    const url = 'https://omegatech-api.dixonomega.tech/api/ai/nano-banana2-result';

    const res = await axios.get(url, {
        params: {
            task_id: taskId
        },
        timeout: 60000
    });

    return res.data;
}

async function nanobanana2(buffer1, buffer2, prompt) {
    try {
        const image1 = await uguu(buffer1);
        const image2 = await uguu(buffer2);

        const taskId = await createNanoBananaJob(image1, image2, prompt);

        let result;
        let attempt = 0;
        const maxAttempt = 30;

        while (attempt < maxAttempt) {
            await new Promise(resolve => setTimeout(resolve, 5000));

            result = await checkNanoBananaResult(taskId);
            attempt++;

            if (result?.status === 'completed' && result?.image_url) {
                return {
                    task_id: taskId,
                    image_url: result.image_url
                };
            }

            if (
                result?.status === 'failed' ||
                result?.status === 'error' ||
                result?.success === false
            ) {
                throw new Error(result?.message || 'Task Nano Banana gagal.');
            }
        }

        throw new Error('Waktu tunggu AI habis / timeout.');
    } catch (err) {
        console.error('NanoBanana2 Error:', err?.response?.data || err.message);
        throw err;
    }
}

module.exports = {
    nanobanana2,
    uguu
};