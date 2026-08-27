import "#db";
import { User, Post } from "#models";

try {
  const newUser = {
    email: "marry@gmail.com",
    password: "12345678",
    firstName: "Marry",
    lastName: "Doe",
  };

  //   const user = await User.create(newUser);

  //   const users = await User.find();
  //   const userByEmail = await User.findOne({ email: "marry@gmail.com" });
  //   const userById = await User.findById("6a8ff07a45a06c600c4ad0f7");

  //   const updatedUser = await User.findByIdAndUpdate(
  //     "6a8ff071fd172bac1d0a372a",
  //     {
  //       email: "Jane@gmail.com",
  //       firstName: "Jane",
  //     },
  //     { returnDocument: "after" },
  //   );

  // const deleteUser = await User.findByIdAndDelete("6a8ff071fd172bac1d0a372a")

  //   console.log(users);

  const newPost = {
    title: "post title",
    description: "post desc",
    author: "6a8fefcd7b5dffacad4b6bfd",
  };

  const posts = await Post.find().populate("author", "email");
  console.log(posts);
} catch (error) {
  console.log(error);
}
