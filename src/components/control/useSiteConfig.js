'use client';
import {useEffect,useState} from 'react';
import {defaultConfig,getSiteConfig} from '../../lib/site-config';
export default function useSiteConfig(){const [config,setConfig]=useState(defaultConfig);useEffect(()=>{const sync=()=>setConfig(getSiteConfig());sync();window.addEventListener('storage',sync);window.addEventListener('amigos-config',sync);window.addEventListener('focus',sync);return()=>{window.removeEventListener('storage',sync);window.removeEventListener('amigos-config',sync);window.removeEventListener('focus',sync)}},[]);return config}
