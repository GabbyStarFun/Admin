"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

export default function Redirect() {
  useEffect(() => {
    window.location.href = "/redirect?r=/api/docs"
  }, );
}