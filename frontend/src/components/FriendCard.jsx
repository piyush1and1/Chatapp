import { Link } from "react-router";
import { NATIONALITY_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-circle w-12 h-12">
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base-content truncate">
              {friend.fullName}
            </h3>
            
            {/* CHANGED: Show nationality instead of language fields */}
            <div className="flex items-center space-x-2 text-sm text-base-content/70 mt-1">
              <div className="flex items-center space-x-1">
                {getNationalityFlag(friend.nationality)}
                <span>From: {friend.nationality}</span>
              </div>
            </div>
          </div>
          
          <Link to={`/chat/${friend._id}`} className="btn btn-primary btn-sm">
            Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;

// CHANGED: Function to get nationality flag instead of language flag
export function getNationalityFlag(nationality) {
  if (!nationality) return null;

  const nationalityLower = nationality.toLowerCase();
  const countryCode = NATIONALITY_TO_FLAG[nationalityLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/16x12/${countryCode}.png`}
        alt={nationality}
        className="inline-block"
      />
    );
  }
  return null;
}
