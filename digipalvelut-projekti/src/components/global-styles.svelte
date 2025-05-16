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
    }
</style>