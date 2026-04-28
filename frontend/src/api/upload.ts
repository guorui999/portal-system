import request from './request';

export const uploadApi = {
  uploadImage: (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
