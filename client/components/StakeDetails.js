import React, { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import StakingAbi from '../constants/Staking.json';
import TokenAbi from '../constants/RewardToken.json';

function StakeDetails() {
  const { account, isWeb3Enabled } = useMoralis();
  const [rtBalance, setRtBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [earnedBalance, setEarnedBalance] = useState('0');

  const stakingAddress = "0x91F009d7816b4BB8F6777ba0dB070F5BcaA2213b"; //replace this with the address where you have deployed your staking Smart Contract
  const rewardTokenAddress = "0x569685Aceb763D3952879020C2f80D56870ce8F2"; //replace this with the address where you have deployed your Reward Token Smart Contract

  const { runContractFunction: getRTBalance } = useWeb3Contract({
    abi: TokenAbi.abi,
    contractAddress: rewardTokenAddress,
    functionName: 'balanceOf',
    params: {
      account
    }
  });

  const { runContractFunction: getStakedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'getStaked',
    params: {
      account
    }
  });

  const { runContractFunction: getEarnedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'earned',
    params: {
      account
    }
  });

  const { runContractFunction: ClaimReward } = useWeb3Contract({
      abi: StakingAbi.abi,
      contractAddress: stakingAddress,
      functionName: 'claimReward',
      params: {
        account
      }
  });


  const claimRewardFn = async () => {
    const earnedBalance = (await ClaimReward({ onError: (error) => console.log(error) })).toString();
    const formattedEarnedBalance = parseFloat(earnedBalance) / 1e18;
    const formattedEarnedBalanceRounded = formattedEarnedBalance.toFixed(2);
    setEarnedBalance(formattedEarnedBalanceRounded);
  }


  useEffect(() => {
    async function updateUiValues() {
      const rtBalance = (await getRTBalance({ onError: (error) => console.log(error) })).toString();
      const formattedRtBalance = parseFloat(rtBalance) / 1e18;
      const formattedRtBalaceRounded = formattedRtBalance.toFixed(2);
      setRtBalance(formattedRtBalaceRounded);

      const stakedBalace = (await getStakedBalance({ onError: (error) => console.log(error) })).toString();
      const formattedStakedBalance = parseFloat(stakedBalace) / 1e18;
      const formattedStakedBalanceRounded = formattedStakedBalance.toFixed(2);
      setStakedBalance(formattedStakedBalanceRounded);

      const earnedBalance = (await getEarnedBalance({ onError: (error) => console.log(error) })).toString();
      const formattedEarnedBalance = parseFloat(earnedBalance) / 1e18;
      const formattedEarnedBalanceRounded = formattedEarnedBalance.toFixed(2);
      setEarnedBalance(formattedEarnedBalanceRounded);
    }

    if (isWeb3Enabled) updateUiValues();
  
}, [account, getEarnedBalance, getRTBalance, getStakedBalance, isWeb3Enabled, ClaimReward]);
return (
    <div className='p-3'>
      <div className='font-bold m-2'>RT Balance is: {rtBalance}</div>
    <div className='font-bold m-2'>Earned Balance is: {earnedBalance}
      {earnedBalance > 0 && (
        <span>
          <button
          onClick={() => claimRewardFn()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mx-2 px-4 rounded-full">Claim Reward</button>
        </span>
      )}

      </div>
      <div className='font-bold m-2'>Staked Balance is: {stakedBalance}</div>
    </div>
  );
}

export default StakeDetails;
