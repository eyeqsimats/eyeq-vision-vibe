import React from "react";
import { motion } from "framer-motion";

interface TeamMemberProps {
  name: string;
  role: string;
  imageUrl: string;
  linkedinUrl: string;
  imageClassName?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  role,
  imageUrl,
  linkedinUrl,
  imageClassName = "object-center",
}) => {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <motion.a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative overflow-hidden rounded-full w-48 h-48 mb-4 group shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={imageUrl}
          alt={`${name} - ${role}`}
          className={`w-full h-full object-cover ${imageClassName}`}
        />

      </motion.a>
      <motion.h3
        className="text-xl font-bold"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {name}
      </motion.h3>
      <motion.p
        className="text-gray-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {role}
      </motion.p>
    </motion.div>
  );
};

export default TeamMember;