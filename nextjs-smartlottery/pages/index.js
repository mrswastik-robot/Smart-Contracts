import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ManualHeader from '../components/ManualHeader'
import Header from '../components/Header'
import LotteryEntrance from '../components/LotteryEntrance'

export default function Home() {
  return (
    <div className={styles.container}>
      {/* <ManualHeader /> */}
      <Header />
      <LotteryEntrance />

    </div>
  )
}
