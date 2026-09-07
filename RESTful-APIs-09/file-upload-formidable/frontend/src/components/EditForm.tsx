import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { getUserById, updateUser } from '../data/users.ts';
import Preview from './Preview.tsx';

const EditForm = () => {
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    image: ''
  });

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const userData = await getUserById('69aaefb10a3ec894965e7477');
        if (!ignore) {
          const { firstName, lastName, email, image } = userData;
          setForm({ firstName, lastName, email, image });
          setImagePreview(image);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Something went wrong');
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => {
      if (e.target.files) {
        return { ...prev, [e.target.name]: e.target.files[0] };
      }
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('email', form.email);
      formData.append('image', form.image);

      const { firstName, lastName, email, image } = await updateUser({
        id: '69aaefb10a3ec894965e7477',
        formData
      });

      setImagePreview(image);

      setForm({ firstName, lastName, email, image });
      toast.success('Profile updated');
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-4xl">File upload</h1>
      <form className="mt-5 w-1/2 mx-auto flex flex-col items-center gap-5" onSubmit={handleSubmit}>
        <label className="input input-bordered flex items-center gap-2 w-full">
          First Name:
          <input
            value={form.firstName}
            onChange={handleChange}
            type="text"
            name="firstName"
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 w-full">
          Last Name:
          <input
            value={form.lastName}
            onChange={handleChange}
            type="text"
            name="lastName"
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 w-full">
          Email:
          <input
            value={form.email}
            onChange={handleChange}
            type="text"
            name="email"
            className="grow"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2 w-full">
          Image:
          <input onChange={handleChange} type="file" name="image" className="grow" />
        </label>

        <button type="submit" className="btn btn-block" disabled={loading}>
          Upload
        </button>
      </form>
      {imagePreview && <Preview image={imagePreview} />}
    </div>
  );
};

export default EditForm;
