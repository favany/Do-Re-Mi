'use client';

import { useState } from 'react';
import useUploadModal from '@/hooks/useUpload';
import { useUser } from '@/hooks/useUser';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { toast } from 'react-hot-toast';
import uniqid from 'uniqid';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      // Reset the form
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields');
        return;
      }

      const uniqueID = uniqid();

      // Upload song
      const { data: songData, error: songError } = await supabaseClient.storage
        .from('songs')
        .upload(`song-${values.title}-${uniqueID}`, songFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        return toast.error('Failed song upload.');
      }

      // Upload image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from('images')
          .upload(`image-${values.title}-${uniqueID}`, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

      if (imageError) {
        setIsLoading(false);
        return toast.error('Failed image upload.');
      }

      const { error: supabaseError } = await supabaseClient
        .from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path,
        });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Song uploaded!');
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error('something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={uploadModal.isOpen}
      onChange={() => {}}
      title="上传音乐"
      description="欢迎您上传您喜欢的音乐，丰富我们的曲库！"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="歌名"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="歌手"
        />
        <div>
          <div className="pb-1">请选择歌曲文件：</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">请选择歌曲封面：</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          创建
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
