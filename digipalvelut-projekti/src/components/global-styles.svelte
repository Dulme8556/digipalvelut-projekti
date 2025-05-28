<style>
    @font-face {
        font-family: "OpenSans";
        src: url("../font/Open_Sans/OpenSans-VariableFont.ttf")
    }

    :global(:root) {
        font-family: 'OpenSans';
    }

    :global(body) {
        margin: 0;
    }

    @media (max-width: 768px) {
        :global(.website) {
            width: 800px;
            transform: scale(0.8);
            transform-origin: left top;
        }

        :global(.content) {
            flex-direction: column;
        }

        :global(.main__functions) {
            flex:1;
            flex-direction: column;
        }

        :global(.main__function) {
            margin: 10px 0;
        }

        :global(.active-lines) {
            transform-origin: left top;
            transform: scale(0.8);
        }
    }
</style>