import React from "react";
import styles from "@/styles/MusicCard.module.css";

export default function MusicCard(musicInfo) {
    return (
        <div className={styles.articleCard}>
            <div className={styles.content}>
                <p className={styles.date}>{musicInfo.music.author}</p>
                <p className={styles.title}>{musicInfo.music.name}</p>
            </div>
            <img src={musicInfo.music.image} alt="article-cover" />
        </div>
    );
}