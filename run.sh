cd deploy
if [ -f ~/venv/bin/activate ]; then
    echo "Activating virtual environment"
    source ~/venv/bin/activate
fi

# npm run build

# (cd scripts && ./build-parallel.sh)

./run.sh aws deploy
