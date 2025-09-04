import { useQuery } from "@tanstack/react-query";
import { UsersIcon } from "lucide-react";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
  const {
    data: friends = [],
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["friends"], queryFn: getUserFriends });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading friends: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <UsersIcon className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Your Friends</h2>
      </div>

      {friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map(friend => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
