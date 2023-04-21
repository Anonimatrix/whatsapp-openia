import axios from 'axios';

export class FileManagerService {
    static async linkToBase64(link: string) {
        try {
            const response = await axios.get(link, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            return buffer.toString('base64');
        } catch (err) {
            console.error(err);
            return '';
        }
    };
}