import { Link } from 'react-router';

type PostCardProps = {
  _id: string;
  content: string;
  image: string;
  title: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

const PostCard = ({ _id, content, image, title, author }: PostCardProps) => {
  return (
    <div className='card bg-base-100 shadow-xl'>
      <figure className='bg-white h-48'>
        <img src={image} alt={title} className='object-cover h-full w-full' />
      </figure>
      <div className='card-body h-56'>
        <h2 className='card-title'>{title}</h2>
        <h3>
          by: {author.firstName} {author.lastName}
        </h3>
        <p className='truncate text-wrap'>{content}</p>
        <Link to={`/post/${_id}`} className='btn btn-primary mt-4'>
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
