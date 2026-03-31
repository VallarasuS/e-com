@echo off

REM Step 1: Make sure we're on main and up to date
git checkout main
git pull origin main

REM Step 2: Copy src contents to a temp folder
rmdir /s /q temp_src 2>nul
mkdir temp_src
xcopy src\* temp_src\ /E /I /Y

REM Step 3: Switch to release branch (create if not exists)
git checkout release 2>nul
IF ERRORLEVEL 1 (
    git checkout -b release
)

REM Step 4: Pull latest release branch
git pull origin release 2>nul

REM Step 5: Clean docs folder
rmdir /s /q docs 2>nul
mkdir docs

REM Step 6: Copy temp_src to docs
xcopy temp_src\* docs\ /E /I /Y

REM Step 7: Commit and push
git add docs
git commit -m "Deploy src to docs folder"
git push origin release --force

REM Step 8: Cleanup
cd ..
rmdir /s /q temp_src

echo Deployment complete!
pause