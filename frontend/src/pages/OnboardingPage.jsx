import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, Zap } from "lucide-react";
import { NATIONALITIES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  // CHANGED: Updated formState to use nationality instead of language fields
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nationality: authUser?.nationality || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-base-content mb-6">
            Complete Your Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PROFILE PIC CONTAINER */}
            <div className="form-control items-center">
              {/* IMAGE PREVIEW */}
              <div className="avatar mb-4">
                {formState.profilePic ? (
                  <div className="w-24 rounded-full">
                    <img src={formState.profilePic} alt="Profile" />
                  </div>
                ) : (
                  <div className="w-24 rounded-full bg-base-300 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-base-content/50" />
                  </div>
                )}
              </div>

              {/* Generate Random Avatar BTN */}
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-outline btn-sm"
              >
                <ShuffleIcon className="w-4 h-4" />
                Random Avatar
              </button>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your interests"
              />
            </div>

            {/* NATIONALITY - CHANGED: Single nationality field instead of two language fields */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nationality</span>
              </label>
              <select
                value={formState.nationality}
                onChange={(e) => setFormState({ ...formState, nationality: e.target.value })}
                className="select select-bordered w-full"
              >
                <option value="">Select your nationality</option>
                {NATIONALITIES.map((nationality) => (
                  <option key={nationality} value={nationality}>
                    {nationality}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderIcon className="animate-spin w-4 h-4" />
                  Completing Profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
