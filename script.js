// =====================================================
// VARIÁVEIS GLOBAIS
// =====================================================

// Música compartilhada entre cenas
let musica;

// Volume global controlado no menu
let volumeGlobal = 0.5;


// =====================================================
// MENU PRINCIPAL
// =====================================================
class MenuScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {

        // Assets do menu
        this.load.image('bg', 'assets/cenario_desfocado_menu.png');
        this.load.image('logo', 'assets/logo_menu.png');
        this.load.audio('musica', 'assets/musica_fundo1.mp3');

    }

    create() {

        const { width, height } = this.scale;

        // Inicia música apenas uma vez
        if (!musica) {

            musica = this.sound.add('musica', {
                loop: true,
                volume: volumeGlobal
            });

            musica.play();
        }

        // Fundo
        const bg = this.add.image(width / 2, height / 2, 'bg');
        bg.setDisplaySize(width, height);

        // Logo
        const logo = this.add.image(width / 2, height * 0.25, 'logo');
        logo.setScale(0.6);


        // Função utilitária para criar botões
        const createButton = (y, text, callback) => {

            return this.add.text(width / 2, y, text, {

                fontFamily: 'Orbitron',
                fontSize: '28px',
                color: '#E6F4FF',
                backgroundColor: '#0B1E3B',
                padding: { x: 50, y: 16 }

            })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerup', callback);
        };


        createButton(height * 0.50, 'JOGAR', () => this.scene.start('IntroScene'));

        createButton(height * 0.62, 'CONFIGURAÇÕES', () => this.scene.start('ConfigScene'));

        createButton(height * 0.74, 'TUTORIAL', () => this.scene.start('TutorialScene'));

        createButton(height * 0.86, 'CRÉDITOS', () => this.scene.start('CreditsScene'));

    }

}


// =====================================================
// CONFIGURAÇÕES
// =====================================================
class ConfigScene extends Phaser.Scene {

    constructor() {
        super({ key: 'ConfigScene' });
    }

    create() {

        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

        this.add.text(width / 2, height * 0.2, 'VOLUME', {

            fontFamily: 'Orbitron',
            fontSize: '40px',
            color: '#E6F4FF',
            fontStyle: "bold"

        }).setOrigin(0.5);


        // Barra de volume
        this.add.rectangle(width / 2, height * 0.4, 300, 6, 0x444444);

        const bar = this.add.rectangle(
            width / 2 - 150 + volumeGlobal * 300,
            height * 0.4,
            12,
            20,
            0x00ffff
        ).setInteractive({ draggable: true });

        this.input.setDraggable(bar);

        // Atualiza volume
        bar.on('drag', (pointer, dragX) => {

            dragX = Phaser.Math.Clamp(dragX, width / 2 - 150, width / 2 + 150);

            bar.x = dragX;

            volumeGlobal = (dragX - (width / 2 - 150)) / 300;

            if (musica) musica.setVolume(volumeGlobal);

        });


        // Botão tutorial
        this.add.text(width / 2, height * 0.6, 'VER TUTORIAL', {

            fontFamily: 'Orbitron',
            fontSize: '26px',
            backgroundColor: '#0B1E3B',
            padding: { x: 30, y: 12 }

        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerup', () => this.scene.start('TutorialScene'));


        // Voltar
        this.add.text(width / 2, height * 0.75, 'VOLTAR', {

            fontFamily: 'Orbitron',
            fontSize: '26px',
            backgroundColor: '#0B1E3B',
            padding: { x: 30, y: 12 }

        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerup', () => this.scene.start('MenuScene'));

    }

}


// =====================================================
// TELA DE TUTORIAL
// =====================================================
class TutorialScene extends Phaser.Scene {

    constructor() {
        super({ key: 'TutorialScene' });
    }

    init(data) {

        // guarda de onde veio
        this.fromPause = data.fromPause || false;

    }

    create() {

        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x101820);

        this.add.text(width / 2, height * 0.2, "TUTORIAL", {

            fontFamily: "Orbitron",
            fontSize: "48px",
            color: "#E6F4FF"

        }).setOrigin(0.5);


        this.add.text(width / 2, height * 0.45,

`MOVIMENTAÇÃO

W → PULAR
A → ESQUERDA
D → DIREITA
S → AÇÃO FUTURA

Use WASD para controlar o personagem.`,

        {

            fontFamily: "Orbitron",
            fontSize: "26px",
            color: "#E6F4FF",
            align: "center"

        }).setOrigin(0.5);


        this.add.text(width / 2, height * 0.85, "VOLTAR",

        {

            fontFamily: "Orbitron",
            fontSize: "28px",
            backgroundColor: "#0B1E3B",
            padding: { x: 40, y: 12 }

        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerup", () => {

            // Se veio do pause menu
            if (this.fromPause) {

                this.scene.stop();
                this.scene.resume("GameScene");
                this.scene.stop("PauseScene");
                this.scene.launch("PauseScene");

            }

            // Se veio do menu
            else {

                this.scene.start("MenuScene");

            }

        });

    }

}

// =====================================================
// CUTSCENE INTRO
// =====================================================
class IntroScene extends Phaser.Scene {

    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {

        this.load.video('intro', 'assets/cutscene_intro.mp4', 'loadeddata', false, true);

    }

    create() {

        const { width, height } = this.scale;

        if (musica && musica.isPlaying) musica.pause();

        const video = this.add.video(width / 2, height / 2, 'intro');

        video.setDisplaySize(width, height);

        video.play();

        video.on('complete', () => this.scene.start('GameScene'));

    }

}


// =====================================================
// JOGO
// =====================================================
class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {

        this.load.image('cenario', 'assets/cenario_game1.jpeg');

        this.load.spritesheet('player', 'assets/Sprite-0001-Sheet2.png', {
            frameWidth: 1140,
            frameHeight: 1940
        });

    }

    create() {

        const { width, height } = this.scale;

        if (musica && musica.isPaused) musica.resume();

        const worldWidth = 5000;

        this.physics.world.setBounds(0, 0, worldWidth, height);

        const cenario = this.add.image(0, height / 2, 'cenario').setOrigin(0, 0.5);
        cenario.setScale(height / cenario.height);


        // Player
        this.player = this.physics.add.sprite(200, height - 200, 'player');

        this.player.setScale(0.3);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1000);


        // Animações
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1
        });


        // Chão
        const ground = this.add.rectangle(worldWidth / 2, height - 50, worldWidth, 100);

        this.physics.add.existing(ground, true);

        this.physics.add.collider(this.player, ground);


        // Câmera
        this.cameras.main.setBounds(0, 0, worldWidth, height);
        this.cameras.main.startFollow(this.player);


        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D');

        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    }

    update() {

        // Pausa com ESC
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {

            this.scene.pause();
            this.scene.launch("PauseScene");

        }

        const speed = 300;

        if (this.cursors.left.isDown || this.keys.A.isDown) {

            this.player.setVelocityX(-speed);
            this.player.anims.play('walk', true);
            this.player.setFlipX(true);

        }
        else if (this.cursors.right.isDown || this.keys.D.isDown) {

            this.player.setVelocityX(speed);
            this.player.anims.play('walk', true);
            this.player.setFlipX(false);

        }
        else {

            this.player.setVelocityX(0);
            this.player.anims.play('idle');

        }

        // Pulo
        if ((this.cursors.up.isDown || this.keys.W.isDown) && this.player.body.touching.down) {

            this.player.setVelocityY(-550);

        }

    }

}


// =====================================================
// MENU DE PAUSA
// =====================================================
class PauseScene extends Phaser.Scene {

    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {

        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

        this.add.text(width / 2, height * 0.3, "JOGO PAUSADO", {

            fontFamily: "Orbitron",
            fontSize: "42px",
            color: "#ffffff"

        }).setOrigin(0.5);


        const createButton = (y, text, callback) => {

            return this.add.text(width / 2, y, text, {

                fontFamily: "Orbitron",
                fontSize: "28px",
                backgroundColor: "#0B1E3B",
                padding: { x: 40, y: 12 }

            })
                .setOrigin(0.5)
                .setInteractive()
                .on("pointerup", callback);

        };


        createButton(height * 0.5, "CONTINUAR", () => {

            this.scene.stop();
            this.scene.resume("GameScene");

        });

        createButton(height * 0.62, "TUTORIAL", () => {

            this.scene.pause();
            this.scene.launch("TutorialScene");

        });

        createButton(height * 0.74, "SAIR", () => {

            this.scene.stop("GameScene");
            this.scene.start("MenuScene");

        });

    }

}


// =====================================================
// CRÉDITOS
// =====================================================
class CreditsScene extends Phaser.Scene {

    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {

        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

        this.add.text(width / 2, height * 0.4,

`CRÉDITOS

Equipe IBM SkillsBuild`,

            {

                fontFamily: 'Orbitron',
                fontSize: '32px',
                color: '#E6F4FF',
                align: 'center'

            }).setOrigin(0.5);


        this.add.text(width / 2, height * 0.8, 'VOLTAR',

            {

                fontFamily: 'Orbitron',
                fontSize: '26px',
                backgroundColor: '#0B1E3B',
                padding: { x: 30, y: 12 }

            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerup', () => this.scene.start('MenuScene'));

    }

}


// =====================================================
// CONFIGURAÇÃO DO JOGO
// =====================================================
const config = {

    type: Phaser.AUTO,

    width: window.innerWidth,
    height: window.innerHeight,

    physics: {

        default: 'arcade',

        arcade: {

            gravity: { y: 300 },
            debug: false

        }

    },

    scene: [

        MenuScene,
        ConfigScene,
        TutorialScene,
        IntroScene,
        GameScene,
        PauseScene,
        CreditsScene

    ]

};

const game = new Phaser.Game(config);


// Responsividade
window.addEventListener('resize', () => {

    game.scale.resize(window.innerWidth, window.innerHeight);

});
