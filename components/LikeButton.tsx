'use client';

import { useState, useEffect, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery } from 'urql';
import gql from 'graphql-tag';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';

interface LikeButtonProps {
  songId: string;
  iconSize?: number;
}

const CHECK_SONG_LIKED = gql`
  query CheckSongLiked($userId: UUID!, $songId: BigInt!) {
    liked_songsCollection(
      filter: { user_id: { eq: $userId }, song_id: { eq: $songId } }
      first: 1
    ) {
      edges {
        node {
          user_id
          song_id
        }
      }
    }
  }
`;

const INSERT_LIKED_SONG = gql`
  mutation InsertLikedSong($userId: UUID!, $songId: BigInt!) {
    insertIntoliked_songsCollection(
      objects: [{ user_id: $userId, song_id: $songId }]
    ) {
      records {
        user_id
        song_id
        created_at
      }
    }
  }
`;

const DELETE_LIKED_SONG = gql`
  mutation DeleteLikedSong($userId: UUID!, $songId: BigInt!) {
    deleteFromliked_songsCollection(
      filter: { user_id: { eq: $userId }, song_id: { eq: $songId } }
    ) {
      records {
        user_id
        song_id
      }
    }
  }
`;

const LikeButton = ({ songId, iconSize = 25 }: LikeButtonProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { onOpen } = useAuthModal();

  const [insertLikeResult, insertLike] = useMutation(INSERT_LIKED_SONG);
  const [deleteLikeResult, deleteLike] = useMutation(DELETE_LIKED_SONG);

  // Check if song is liked
  const [checkLikedResult] = useQuery({
    query: CHECK_SONG_LIKED,
    variables: {
      userId: user?.id || '',
      songId: parseInt(songId, 10), // Pass as number, GraphQL will handle BigInt conversion
    },
    pause: !user?.id,
  });

  const isLiked = checkLikedResult.data?.liked_songsCollection?.edges?.length > 0;

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      return onOpen();
    }

    const songIdNum = parseInt(songId, 10); // Pass as number, GraphQL will handle BigInt conversion

    // Unlike
    if (isLiked) {
      const result = await deleteLike({
        userId: user.id,
        songId: songIdNum,
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        router.refresh();
      }
    } else {
      const result = await insertLike({
        userId: user.id,
        songId: songIdNum,
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success('Liked!', { id: 'like' });
        router.refresh();
      }
    }
  };

  return (
    <button className='hover:opacity-75 transition' onClick={handleLike}>
      <Icon color={isLiked ? '#ec4899' : 'white'} size={iconSize} />
    </button>
  );
};

export default LikeButton;
