import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getNationalityFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FRIENDS SECTION */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-base-content flex items-center">
              <UsersIcon className="mr-2" />
              Your Friends
            </h2>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="space-y-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </div>

        {/* RECOMMENDED USERS SECTION */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-base-content flex items-center mb-2">
              <UserPlusIcon className="mr-2" />
              Meet New People
            </h2>
            <p className="text-base-content/60">
              Discover people from different nationalities based on your profile
            </p>
          </div>

          <div className="space-y-4">
            {loadingUsers ? (
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  No recommendations available
                </h3>
                <p className="text-base-content/60">
                  Check back later for new connections!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200"
                    >
                      <div className="card-body">
                        <div className="flex items-start space-x-4">
                          <div className="avatar">
                            <div className="mask mask-circle w-16 h-16">
                              <img src={user.profilePic} alt={user.fullName} />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-base-content">
                              {user.fullName}
                            </h3>
                            {user.location && (
                              <p className="text-sm text-base-content/60 flex items-center">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {user.location}
                              </p>
                            )}

                            {/* CHANGED: Show nationality instead of languages */}
                            <div className="flex items-center space-x-2 text-sm text-base-content/70 mt-2">
                              <div className="flex items-center space-x-1">
                                {getNationalityFlag(user.nationality)}
                                <span>Nationality: {capitialize(user.nationality)}</span>
                              </div>
                            </div>

                            {user.bio && <p className="text-sm mt-2 text-base-content/80">{user.bio}</p>}

                            {/* Action button */}
                            <div className="mt-4">
                              <button
                                onClick={() => sendRequestMutation(user._id)}
                                disabled={hasRequestBeenSent || isPending}
                                className={`btn btn-sm ${
                                  hasRequestBeenSent ? "btn-success" : "btn-primary"
                                }`}
                              >
                                {hasRequestBeenSent ? (
                                  <>
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Request Sent
                                  </>
                                ) : (
                                  <>
                                    <UserPlusIcon className="w-4 h-4" />
                                    Add Friend
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
