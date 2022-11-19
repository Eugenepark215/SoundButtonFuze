insert into "users" ("username", "hashedPassword")
values ('me', 'asdfasdfasdf');

insert into "sounds" ("userId", "soundName", "fileUrl", "uploadedAt")
values (1, 'ahyoawho-rezero', '/sounds/ahyoawhoa.mp3', now()),
        (1, 'anime-wow', '/sounds/anime-wow.mp3', now()),
        (1, 'aughhhhhx2', '/sounds/aughhhhhx2.mp3', now()),
       (1, 'another-one', '/sounds/another-one.mp3', now()),
       (1, 'ara-ara','/sounds/ara-ara.mp3', now()),
       (1, 'ayo-peepeepoopoo-check', '/sounds/ayo-peepeepoopoo-check.mp3', now()),
       (1, 'babaooey','/sounds/bababooey.mp3', now()),
        (1, 'boom','/sounds/boom.mp3', now()),
        (1, 'chewbacca','/sounds/chewbacca.mp3', now()),
        (1, 'coochieman','/sounds/coochieman.mp3', now()),
       (1, 'damn-son-whered-you-find-this', '/sounds/damn-son-whered-you-find-this.mp3', now()),
       (1, 'falconpunch','/sounds/falconpunch.mp3', now()),
       (1, 'fbi-open-up-sfx','/sounds/fbi-open-up-sfx.mp3', now()),
       (1, 'fortnite-default-dance-bass-boosted','/sounds/fortnite-default-dance-bass-boosted.mp3', now()),
        (1, 'omaewa-mou-shindereriru-NANI?','sounds/omaewamoushinderiru.mp3', now()),
       (1, 'you-kinda-smell-like-a-baka','/sounds/you-kinda-smell-like-a-baka.mp3', now()),
       (1, 'yeet','/sounds/yeet.mp3', now());

insert into "bookmarks" ("userId", "soundId")
values ('1', 1),
        ('1', 2),
        ('1', 3),
        ('1', 4),
        ('1', 5),
        ('1', 6),
        ('1', 7),
        ('1', 8),
        ('1', 9)
