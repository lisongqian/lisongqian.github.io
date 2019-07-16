---
layout: article
tags: DeepLearning
description: Marchine Learning
---

### Preparation

#### 支持的 GPUs

ROCm正式支持使用以下芯片的AMD GPU：

- GFX8 GPUs
  - “Fiji” chips, such as on the AMD Radeon R9 Fury X and Radeon Instinct MI8
  - “Polaris 10” chips, such as on the AMD Radeon RX 580 and Radeon Instinct MI6
  - “Polaris 11” chips, such as on the AMD Radeon RX 570 and Radeon Pro WX 4100
  - “Polaris 12” chips, such as on the AMD Radeon RX 550 and Radeon RX 540
- GFX9 GPUs
  - “Vega 10” chips, such as on the AMD Radeon RX Vega 64 and Radeon Instinct MI25
  - “Vega 7nm” chips

有关硬件支持的更详细列表，见[Hardware to Play ROCm](https://rocm.github.io/hardware.html)

#### 使用的OS

> Ubuntu

安装系统后保证系统是最新的：

```sh
sudo apt update
sudo apt upgrade -y
sudo apt install libnuma-dev -y
sudo apt autoremove -y
sudo reboot
```

#### 快速的网络连接(可选)

1. 系统连接Shadowsocks服务器。这里建议使用shadowsocks-qt5客户端，点击[【这里】](https://github.com/shadowsocks/shadowsocks-qt5/releases/download/v3.0.1/Shadowsocks-Qt5-3.0.1-x86_64.AppImage)下载shadowsocks-qt5可执行文件

2. 将下载完成的文件放到你喜欢的位置，然后在这个目录打开终端，给文件添加可执行权限：
   `chmod a+x Shadowsocks-Qt5-3.0.1-x86_64.AppImage`

3. 启动shadowsocks-qt5客户端：
   `./Shadowsocks-Qt5-3.0.1-x86_64.AppImage`

4. 在下图所示的客户端图形配置界面里面填写正确的服务器信息，注意本地代理类型推荐使用socks5。完成后点击连接按钮。

   ![img](https://www.shenjc.net/images/190527-pytorch-on-rocm/figure_3.png)

5. 安装tsocks。使用以下命令安装tsocks：`sudo apt install tsocks -y`. 修改`/etc/tsocks.conf`文件使得最后三行设置和你shadowsocks-qt5中本地代理的设置相同，默认情况应该是这样：

```
server = 127.0.0.1
server_type = 5
server_port = 1080
```

6. 安装git。Ubuntu默认是没有git的，所以使用以下命令安装git：`sudo apt install git -y`.

7. 配置git使其通过shadowsocks加速。通过以下配置，让git走shadowsocks的socks5代理：

```
git config --global http.proxy 'socks5://127.0.0.1:1080' 
git config --global https.proxy 'socks5://127.0.0.1:1080'
```

#### 安装依赖

1. 确保ROCm的包已经安装完全：

```
sudo apt updatesudo apt install rock-dkms rocm-dev rocm-libs miopen-hip hipsparse hip-thrust rccl
```

2. 安装编译所需要的工具，编译完成后可以选择删除：

```
sudo apt install git python-pip libopenblas-dev cmake libnuma-dev autoconf build-essential ca-certificates curl libgoogle-glog-dev libhiredis-dev libiomp-dev libleveldb-dev liblmdb-dev libopencv-dev libpthread-stubs0-dev libsnappy-dev sudo vim libprotobuf-dev protobuf-compiler
```

3. 安装anaconda(可选，建议)。具体步骤请参考[【这个链接】](https://docs.conda.io/projects/conda/en/latest/user-guide/install/)。如果安装了anaconda，使用以下命令创建并进入pytorch专用环境：

```
conda create --name pytorch python=3.6source activate pytorch
```

4. 安装PyTorch的Python依赖包：

```
pip install enum34 numpy pyyaml setuptools typing cffi future hypothesis
```

### 安装AMD ROCm平台

由于AMD ROCm包含了单独的驱动，而且和普通的游戏驱动不能共存，所以首先确保系统中不存在AMD GPU-PRO版显卡驱动。如果有，使用以下命令删除驱动并重新启动：

```
sudo amdgpu-pro-uninstallsudo apt autoremove -ysudo reboot
```

1. 添加ROCm的apt仓库。使用以下命令将ROCm的官方apt仓库添加到你的apt源中：

```
wget -qO - http://repo.radeon.com/rocm/apt/debian/rocm.gpg.key | sudo apt-key add - echo 'deb [arch=amd64] http://repo.radeon.com/rocm/apt/debian/ xenial main' | sudo tee /etc/apt/sources.list.d/rocm.list
```

2. 通过apt安装rocm-dkms包。使用以下命令安装rocm-dkms包：

```
sudo apt updatesudo apt install rocm-dkms
```

安装大约要下载400MB的数据。如果你发现你的下载速度特别慢，这时候就可以用到上面安装和配置的tsocks来加速apt。使用以下命令来代替刚才的命令：

```
sudo tsocks apt updatesudo tsocks apt install rocm-dkms
```

如果你的加速节点连接地球网络比较通畅，那你会发现下载时间从半天变成了十几分钟，爽到😏！

3. 为你的用户添加GPU访问权。使用以下命令将你的用户添加到可以访问GPU的用户组中：

```
sudo usermod -a -G video $LOGNAME
```

使用以下命令可以让你以后为系统新添加的用户都有GPU访问权：

```
echo 'ADD_EXTRA_GROUPS=1' | sudo tee -a /etc/adduser.confecho 'EXTRA_GROUPS=video' | sudo tee -a /etc/adduser.conf
```

4. 将ROCm添加到PATH环境变量中

```
echo 'export PATH=$PATH:/opt/rocm/bin:/opt/rocm/profiler/bin:/opt/rocm/opencl/bin/x86_64' | sudo tee -a /etc/profile.d/rocm.sh
```

5. 检查是否正确安装：

```
/opt/rocm/bin/rocminfo /opt/rocm/opencl/bin/x86_64/clinfo
```

6. **可选**。安装radeontop来监测GPU使用情况。

```
sudo apt install radeontopsudo radeontop
```

### 编译安装PyTorch on ROCm

1. 正如最开始说的，目前ROCm平台还存在一些缺陷，因此编译PyTorch需要修改ROCm平台。修改后的ROCm平台可能不能编译或者运行其他深度学习框架。在root权限下运行以下命令：

   ```
   sed -i 's/find_dependency(hip)/find_dependency(HIP)/g' /opt/rocm/rocsparse/lib/cmake/rocsparse/rocsparse-config.cmakesed -i 's/find_dependency(hip)/find_dependency(HIP)/g' /opt/rocm/rocfft/lib/cmake/rocfft/rocfft-config.cmakesed -i 's/find_dependency(hip)/find_dependency(HIP)/g' /opt/rocm/miopen/lib/cmake/miopen/miopen-config.cmakesed -i 's/find_dependency(hip)/find_dependency(HIP)/g' /opt/rocm/rocblas/lib/cmake/rocblas/rocblas-config.cmake
   ```

   请各位读者注意，若新版的ROCm平台修复此问题，请忽略该步骤。

2. **拉取PyTorch的源代码**。建议拉取AMD ROCm software团队的fork仓库：

   ```
   git clone https://github.com/ROCmSoftwarePlatform/pytorch.git
   ```

3. **拉取PyTorch的子模块**

   ```
   cd pytorchgit submodule update --init --recursive
   ```

   正常情况下，步骤2和步骤3大约需要下载500MB的数据。

4. **配置GPU类型**。通过设置环境变量，指明编译针对的GPU类型，例如我的RX 550为gfx803，则我的设置为：`export PYTORCH_ROCM_ARCH=gfx803`

5. **(可选，仅针对使用anaconda)删除conda环境中的ld**。conda环境中自己有一个ld，会覆盖系统中自带的`/usr/bin/ld`，会导致编译出问题。通过重命名的方式使其不影响编译：

   ```
   cd ~/anaconda3/envs/pytorch/compiler_compatmv ld ld-tmpcd -
   ```

   在编译完成后可以改回。

6. 使用AMD提供的脚本将PyTorch中的CUDA函数重用为ROCm中的hip函数。

   ```
   python tools/amd_build/build_amd.py
   ```

7. 编译安装PyTorch：

   ```
   export USE_NINJA=1 # 可选USE_ROCM=1 USE_LMDB=1 BUILD_CAFFE2_OPS=0 BUILD_TEST=0 USE_OPENCV=1 MAX_JOBS=N python setup.py install
   ```

   其中，N为编译时使用的线程数。N越大则编译速度越快，但是要注意的是，请不要把N设的太大，在编译过程中，进程最高会占用5GB的内存，因此请保证5*N小于你的内存总量。否则内存要是超出了可是会死机的。如果因为N设置过大导致编译失败，请使用命令`python setup.py clean`清空编译环境后再重新编译。

8. 编译会比较耗时间。在此期间请不要使用内存占用过高的程序，避免因为内存不足导致编译失败。

9. 编译安装torchvision

   ```
   git clone https://github.com/pytorch/visioncd visionpython setup.py installcd ..
   ```

10. 运行PyTorch测试

    ```
    PYTORCH_TEST_WITH_ROCM=1 python test/run_test.py --verbose
    ```

    可以发现，通过的测试数量比上次Docker安装的更加多了。说明这次的PyTorch安装功能更加完整，理论上能提供更好的开发体验。

11. 将`～/anaconda3/envs/pytorch/bin/python`设置为你开发环境的解释器

#### REFERENCE

- [AMD显卡上完美原生运行PyTorch教程，无需容器(Docker)](https://www.shenjc.net/2019/06/02/190601_pytorch_on_rocm_native/)
- [ROCm Platform Installation Guide for Linux](https://rocm.github.io/ROCmInstall.html)